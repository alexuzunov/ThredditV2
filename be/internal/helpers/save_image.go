package helpers

import (
	"encoding/base64"
	"os"
	"path/filepath"
)

func SaveImage(imageData string, imageName string) (string, error) {
	// Decode the base64 image
	imageBytes, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return "", err
	}

	// Define the image path
	imagePath := filepath.Join("uploads", imageName)

	// Create the uploads directory if it doesn't exist
	if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
		return "", err
	}

	// Write the image file
	if err := os.WriteFile(imagePath, imageBytes, 0644); err != nil {
		return "", err
	}

	return imagePath, nil
}
