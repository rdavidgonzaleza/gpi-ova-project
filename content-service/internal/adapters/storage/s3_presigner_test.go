package storage

import (
	"context"
	"strings"
	"testing"
	"time"
)

// Ejemplo oficial de AWS ("Authenticating Requests: Using Query
// Parameters"), con path-style: la firma debe coincidir exactamente.
func TestPresignMatchesAWSReferenceExample(t *testing.T) {
	p, err := NewS3Presigner(Config{
		Endpoint: "https://examplebucket.s3.amazonaws.com", Region: "us-east-1", Bucket: "unused",
		AccessKeyID: "AKIAIOSFODNN7EXAMPLE", SecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
	})
	if err != nil {
		t.Fatal(err)
	}
	now := time.Date(2013, 5, 24, 0, 0, 0, 0, time.UTC)
	got := p.presign("GET", "/test.txt", nil, 86400*time.Second, now)
	want := "aeeed9bbccd4d02ee5c0109b86d86835f995330da4c265957d157751f604d404"
	if !strings.HasSuffix(got, "X-Amz-Signature="+want) {
		t.Fatalf("firma distinta a la de referencia:\n%s", got)
	}
}

func TestPresignUploadBuildsPublicURL(t *testing.T) {
	p, _ := NewS3Presigner(Config{
		Endpoint: "https://s3.us-east-005.backblazeb2.com", Region: "us-east-005", Bucket: "hito-media",
		AccessKeyID: "k", SecretAccessKey: "s", PublicBaseURL: "https://f005.backblazeb2.com/file/hito-media/",
	})
	up, err := p.PresignUpload(context.Background(), "ovas/x/y-video.mp4", "video/mp4")
	if err != nil {
		t.Fatal(err)
	}
	if up.PublicURL != "https://f005.backblazeb2.com/file/hito-media/ovas/x/y-video.mp4" {
		t.Errorf("public url = %s", up.PublicURL)
	}
	if !strings.HasPrefix(up.UploadURL, "https://s3.us-east-005.backblazeb2.com/hito-media/ovas/x/y-video.mp4?") ||
		!strings.Contains(up.UploadURL, "X-Amz-SignedHeaders=content-type%3Bhost") {
		t.Errorf("upload url = %s", up.UploadURL)
	}
}
