package domain

import (
	"path"
	"regexp"
	"strings"
)

// AllowedMediaTypes son los tipos MIME que se aceptan para los bloques imagen
// y video de un OVA.
var AllowedMediaTypes = map[string]BlockType{
	"image/png":     BlockImage,
	"image/jpeg":    BlockImage,
	"image/webp":    BlockImage,
	"image/gif":     BlockImage,
	"image/svg+xml": BlockImage,
	"video/mp4":     BlockVideo,
	"video/webm":    BlockVideo,
}

var unsafeChars = regexp.MustCompile(`[^a-z0-9._-]+`)

// MediaKey arma la ruta del objeto en el bucket: ovas/<ova>/<id>-<nombre>.
func MediaKey(ovaID, objectID, fileName string) string {
	name := strings.ToLower(path.Base(strings.ReplaceAll(fileName, `\`, "/")))
	name = strings.Trim(unsafeChars.ReplaceAllString(name, "-"), "-.")
	if name == "" {
		name = "archivo"
	}
	if len(name) > 80 {
		name = name[len(name)-80:]
	}
	return "ovas/" + ovaID + "/" + objectID + "-" + name
}
