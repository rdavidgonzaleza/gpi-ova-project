// Package storage implementa ports.MediaStorage contra cualquier
// almacenamiento compatible con S3. En la v1 se usa Backblaze B2 (plan
// gratuito de 10 GB), pero sirve igual para AWS S3, Cloudflare R2 o MinIO.
//
// Las URLs se firman con AWS Signature V4 (query string) usando solo la
// librería estándar, para no traer el SDK completo de AWS.
package storage

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/url"
	"sort"
	"strings"
	"time"

	"content-service/internal/ports"
)

type Config struct {
	Endpoint        string // ej. https://s3.us-east-005.backblazeb2.com
	Region          string // ej. us-east-005
	Bucket          string
	AccessKeyID     string // keyID de la Application Key de B2
	SecretAccessKey string // applicationKey de B2
	PublicBaseURL   string // opcional; por defecto <endpoint>/<bucket>
	Expires         time.Duration
}

// Configured indica si están todas las variables obligatorias.
func (c Config) Configured() bool {
	return c.Endpoint != "" && c.Region != "" && c.Bucket != "" && c.AccessKeyID != "" && c.SecretAccessKey != ""
}

type S3Presigner struct {
	cfg  Config
	host string
	base string
	now  func() time.Time
}

func NewS3Presigner(cfg Config) (*S3Presigner, error) {
	endpoint, err := url.Parse(strings.TrimRight(cfg.Endpoint, "/"))
	if err != nil || endpoint.Host == "" {
		return nil, fmt.Errorf("S3_ENDPOINT inválido: %q", cfg.Endpoint)
	}
	if cfg.Expires <= 0 {
		cfg.Expires = 15 * time.Minute
	}
	public := strings.TrimRight(cfg.PublicBaseURL, "/")
	if public == "" {
		public = endpoint.String() + "/" + cfg.Bucket
	}
	cfg.PublicBaseURL = public
	return &S3Presigner{cfg: cfg, host: endpoint.Host, base: endpoint.Scheme + "://" + endpoint.Host, now: time.Now}, nil
}

func (p *S3Presigner) PresignUpload(_ context.Context, key, contentType string) (ports.PresignedUpload, error) {
	now := p.now().UTC()
	signed := p.presign("PUT", "/"+p.cfg.Bucket+"/"+key, map[string]string{"content-type": contentType}, p.cfg.Expires, now)
	return ports.PresignedUpload{
		UploadURL: signed,
		PublicURL: p.cfg.PublicBaseURL + "/" + escapePath(key),
		Key:       key,
		ExpiresAt: now.Add(p.cfg.Expires),
	}, nil
}

// presign genera una URL firmada (SigV4, path-style). Los encabezados dados
// quedan firmados: el cliente debe enviarlos con el mismo valor.
func (p *S3Presigner) presign(method, path string, headers map[string]string, expires time.Duration, now time.Time) string {
	amzDate := now.Format("20060102T150405Z")
	day := now.Format("20060102")
	scope := day + "/" + p.cfg.Region + "/s3/aws4_request"

	all := map[string]string{"host": p.host}
	for k, v := range headers {
		all[strings.ToLower(k)] = strings.TrimSpace(v)
	}
	names := make([]string, 0, len(all))
	for k := range all {
		names = append(names, k)
	}
	sort.Strings(names)
	var canonicalHeaders strings.Builder
	for _, k := range names {
		canonicalHeaders.WriteString(k + ":" + all[k] + "\n")
	}
	signedHeaders := strings.Join(names, ";")

	query := map[string]string{
		"X-Amz-Algorithm":     "AWS4-HMAC-SHA256",
		"X-Amz-Credential":    p.cfg.AccessKeyID + "/" + scope,
		"X-Amz-Date":          amzDate,
		"X-Amz-Expires":       fmt.Sprint(int(expires.Seconds())),
		"X-Amz-SignedHeaders": signedHeaders,
	}
	canonicalQuery := encodeQuery(query)
	canonicalPath := escapePath(path)

	canonicalRequest := strings.Join([]string{
		method, canonicalPath, canonicalQuery, canonicalHeaders.String(), signedHeaders, "UNSIGNED-PAYLOAD",
	}, "\n")
	hash := sha256.Sum256([]byte(canonicalRequest))
	stringToSign := "AWS4-HMAC-SHA256\n" + amzDate + "\n" + scope + "\n" + hex.EncodeToString(hash[:])

	key := hmacSHA256([]byte("AWS4"+p.cfg.SecretAccessKey), day)
	key = hmacSHA256(key, p.cfg.Region)
	key = hmacSHA256(key, "s3")
	key = hmacSHA256(key, "aws4_request")
	signature := hex.EncodeToString(hmacSHA256(key, stringToSign))

	return p.base + canonicalPath + "?" + canonicalQuery + "&X-Amz-Signature=" + signature
}

func hmacSHA256(key []byte, data string) []byte {
	mac := hmac.New(sha256.New, key)
	mac.Write([]byte(data))
	return mac.Sum(nil)
}

func encodeQuery(values map[string]string) string {
	keys := make([]string, 0, len(values))
	for k := range values {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	parts := make([]string, len(keys))
	for i, k := range keys {
		parts[i] = uriEncode(k, true) + "=" + uriEncode(values[k], true)
	}
	return strings.Join(parts, "&")
}

func escapePath(path string) string { return uriEncode(path, false) }

// uriEncode sigue la codificación RFC 3986 que exige SigV4.
func uriEncode(s string, encodeSlash bool) string {
	var b strings.Builder
	for i := 0; i < len(s); i++ {
		c := s[i]
		switch {
		case 'A' <= c && c <= 'Z', 'a' <= c && c <= 'z', '0' <= c && c <= '9', c == '-', c == '_', c == '.', c == '~':
			b.WriteByte(c)
		case c == '/' && !encodeSlash:
			b.WriteByte(c)
		default:
			fmt.Fprintf(&b, "%%%02X", c)
		}
	}
	return b.String()
}
