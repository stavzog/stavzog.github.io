package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	port := ":8080"
	dir := "./dist"

	fmt.Printf("Serving %s on http://localhost%s\n", dir, port)

	// Create a file server for the "dist" directory
	fs := http.FileServer(http.Dir(dir))

	// Start the server
	err := http.ListenAndServe(port, fs)
	if err != nil {
		log.Fatal(err)
	}
}
