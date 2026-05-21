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
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"gopkg.in/yaml.v3"
)

type Page struct {
	Title        string        `yaml:"title"`
	DisplayTitle template.HTML // For bottom-heavy formatting
	Date         string        `yaml:"date"`
	Status       string        `yaml:"status,omitempty"` // For projects
	Content      template.HTML
	Slug         string
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

	// Initialize goldmark with highlighting
	md := goldmark.New(
		goldmark.WithExtensions(
			highlighting.NewHighlighting(
				highlighting.WithStyle("igor"), // theme
			),
		),
	)

	siteData := SiteData{}

	// 2. Process Blog Posts
	fmt.Println("Processing blog posts...")
	siteData.BlogPosts = processDirectory(filepath.Join(contentDir, "blog"), md)

	// 3. Process Projects
	fmt.Println("Processing projects...")
	siteData.Projects = processDirectory(filepath.Join(contentDir, "projects"), md)

	// Sort by date descending
	sortPages(siteData.BlogPosts)
	sortPages(siteData.Projects)

	// 4. Load Templates
	fmt.Println("Loading templates...")
	tmpl, err := template.ParseGlob(filepath.Join(templateDir, "*.html"))
	if err != nil {
		log.Fatalf("error parsing templates: %v", err)
	}

	// 5. Generate Individual Pages
	fmt.Println("Generating individual pages...")
	for _, p := range siteData.BlogPosts {
		generatePage(filepath.Join(outputDir, "blog", p.Slug+".html"), "post.html", tmpl, p)
	}
	for _, p := range siteData.Projects {
		generatePage(filepath.Join(outputDir, "projects", p.Slug+".html"), "project.html", tmpl, p)
	}

	// 6. Generate Index Page
	fmt.Println("Generating index page...")
	generatePage(filepath.Join(outputDir, "index.html"), "index.html", tmpl, siteData)

	// 7. Copy static assets
	fmt.Println("Copying static assets...")
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
		page.DisplayTitle = formatBottomHeavy(page.Title)

		pages = append(pages, page)
		return nil
	})
	return pages
}

func formatBottomHeavy(title string) template.HTML {
	words := strings.Fields(title)
	if len(words) < 4 {
		return template.HTML(title)
	}

	bestBreak := len(words) / 2
	minDiff := 1000000

	for i := 1; i < len(words); i++ {
		line1 := strings.Join(words[:i], " ")
		line2 := strings.Join(words[i:], " ")

		len1 := len(line1)
		len2 := len(line2)

		// Goal: line2 > line1, and minimize the difference
		if len2 >= len1 {
			diff := len2 - len1
			if diff < minDiff {
				minDiff = diff
				bestBreak = i
			}
		}
	}

	formatted := strings.Join(words[:bestBreak], " ") + "<br>" + strings.Join(words[bestBreak:], " ")
	return template.HTML(formatted)
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
