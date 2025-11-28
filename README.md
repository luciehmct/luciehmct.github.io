# Portfolio CV Website

This repository contains a personal portfolio website designed to showcase projects and provide information about skills and experience.

## Project Structure

```
portfolio-cv-website
├── src
│   ├── index.html          # Main entry point of the website
│   ├── about.html          # Information about the author
│   ├── projects.html       # Showcase of projects
│   ├── contact.html        # Contact information and form
│   ├── css
│   │   └── styles.css      # Styles for the website
│   ├── js
│   │   └── main.js         # JavaScript for interactivity
│   └── data
│       └── projects.json    # Project data in JSON format
├── .github
│   └── workflows
│       └── deploy.yml      # GitHub Actions for deployment
├── .gitignore              # Files and directories to ignore by Git
├── package.json            # npm configuration file
└── README.md               # Documentation for the project
```

## Features

- **Responsive Design**: The website is designed to be responsive and accessible on various devices.
- **Dynamic Project Display**: Projects are loaded dynamically from a JSON file, making it easy to update and manage project information.
- **Contact Form**: A contact form allows visitors to reach out directly.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/portfolio-cv-website.git
   ```
2. Navigate to the project directory:
   ```
   cd portfolio-cv-website
   ```
3. Install dependencies (if any):
   ```
   npm install
   ```
4. Open `src/index.html` in your browser to view the website.

## Draft created from attached CV

I used details from the attached CV to draft the site. Assumptions made while drafting:
 
 - Your full name is "Lucie Huamani-Cantrelle" (confirmed in this session).
 - I included contact handles found in the CV header (email and short handles). I inferred probable GitHub (`luciehmct`) and LinkedIn (`lucie-huamani-cantrelle`) URLs — please confirm or correct these.
 - I populated `src/data/projects.json` with the three project entries listed under "Projects" in your CV and added `lmms-eval` as your most recent project. I also added your lmms presentation PDF to `src/assets/` and linked it from the lmms-eval project card.

## Deploy to GitHub Pages (quick)

1. Create a new repository on GitHub and push this project.
2. In the repository Settings → Pages, set the source to the `gh-pages` branch (if you use the `gh-pages` package) or to the `main` branch `/root` and the `src/` folder if you prefer a static directory.
3. Alternatively run the `gh-pages` deploy script from `package.json`:

```bash
npm install
npm run deploy
```

This README and the site files are intentionally left with placeholders (email, project links). Tell me which exact projects, dates, and wording you want pulled from the CV and I will replace the placeholders in the site files.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.

## License

This project is licensed under the MIT License.