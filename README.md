# Deployment Link: https://risinggeek.github.io/instagram-stories/

# Running the project locally

```
// Install the dependencies
npm install

// Run the Project
npm start 
```

# Running the tests
```
// Run the project 
npm start

// Start running Cypress tests
npm run cypress:open
```


# Design Choices for Performance and Scalability:

1. **Image Preloading:**
- **Optimization**: My primary performance optimization is the preloading of the next story's image while the current story is being viewed. Instead of waiting for an image to fetch and render when the user navigates or the auto-advance timer completes, the image is already available to be viewed.
- **Implementation**: When a story is displayed, I trigger the loading of the subsequent story's image in the background. I have done this by creating an Image object in JavaScript and setting its src. Once the image is loaded, it's ready to be rendered instantly when needed.
- **Scalability**: This approach scales well because it doesn't add a significant overhead to the initial load. Each story's preloading is independent, preventing a bottleneck as the number of stories increases.

2. **Component-Based Architecture (React.js):**
- **Optimization**: I have used React functional components which promotes modularity and reusability. I've broken down the Stories feature into smaller, focused components (e.g. StoryList, StoryViewer, ActionButtons, ImageLoader, StoryHeader, StoryProgress).
- **Scalability**: New features or modifications can be done to specific components without impacting the entire application. This reduces the risk of introducing bugs and simplifies maintenance as the codebase grows.
e