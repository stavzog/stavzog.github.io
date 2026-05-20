package main

import (
	"bytes"
	"fmt"
	"html/template"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/yuin/goldmark"
	"gopkg.in/yaml.v3"
)

type Page struct {
	Title   string `yaml:"title"`
	Date    string `yaml:"date"`
	Status  string `yaml:"status,omitempty"` // For projects
	Content template.HTML
	Slug    string
}

type SiteData struct {
	BlogPosts []Page
	Projects  []Page
}

func main() {
	// 1. Setup
	contentDir := "content"
	outputDir := "dist"
	templateDir := "templates"

	// Ensure output directory exists
	os.RemoveAll(outputDir)
	os.MkdirAll(outputDir, 0755)

	// Initialize goldmark
	md := goldmark.New()

	siteData := SiteData{}

	// 2. Process Blog Posts
	siteData.BlogPosts = processDirectory(filepath.Join(contentDir, "blog"), md)

	// 3. Process Projects
	siteData.Projects = processDirectory(filepath.Join(contentDir, "projects"), md)

	// Sort by date descending
	sortPages(siteData.BlogPosts)
	sortPages(siteData.Projects)

	// 4. Load Templates
	tmpl, err := template.ParseGlob(filepath.Join(templateDir, "*.html"))
	if err != nil {
		log.Fatalf("error parsing templates: %v", err)
	}

	// 5. Generate Individual Pages
	for _, p := range siteData.BlogPosts {
		generatePage(filepath.Join(outputDir, "blog", p.Slug+".html"), "post.html", tmpl, p)
	}
	for _, p := range siteData.Projects {
		generatePage(filepath.Join(outputDir, "projects", p.Slug+".html"), "project.html", tmpl, p)
	}

	// 6. Generate Index Page
	generatePage(filepath.Join(outputDir, "index.html"), "index.html", tmpl, siteData)

	// 7. Copy static assets
	copyStatic("static", filepath.Join(outputDir, "static"))

	fmt.Println("Build complete!")
}

func processDirectory(dir string, md goldmark.Markdown) []Page {
	var pages []Page
	filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() || !strings.HasSuffix(path, ".md") {
			return nil
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		// Split frontmatter and content
		parts := strings.SplitN(string(data), "---", 3)
		if len(parts) < 3 {
			return fmt.Errorf("invalid frontmatter in %s", path)
		}

		page := Page{}
		if err := yaml.Unmarshal([]byte(parts[1]), &page); err != nil {
			return fmt.Errorf("error parsing yaml in %s: %v", path, err)
		}

		var buf bytes.Buffer
		if err := md.Convert([]byte(parts[2]), &buf); err != nil {
			return err
		}
		page.Content = template.HTML(buf.String())
		page.Slug = strings.TrimSuffix(d.Name(), ".md")

		pages = append(pages, page)
		return nil
	})
	return pages
}

func generatePage(outPath string, tmplName string, tmpl *template.Template, data interface{}) {
	os.MkdirAll(filepath.Dir(outPath), 0755)
	f, err := os.Create(outPath)
	if err != nil {
		log.Fatalf("error creating file %s: %v", outPath, err)
	}
	defer f.Close()

	if err := tmpl.ExecuteTemplate(f, tmplName, data); err != nil {
		log.Fatalf("error executing template %s: %v", tmplName, err)
	}
}

func sortPages(pages []Page) {
	sort.Slice(pages, func(i, j int) bool {
		return pages[i].Date > pages[j].Date
	})
}

func copyStatic(src, dst string) {
	os.MkdirAll(dst, 0755)
	filepath.WalkDir(src, func(path string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() {
			return nil
		}
		rel, _ := filepath.Rel(src, path)
		target := filepath.Join(dst, rel)
		os.MkdirAll(filepath.Dir(target), 0755)

		input, _ := os.ReadFile(path)
		os.WriteFile(target, input, 0644)
		return nil
	})
}
