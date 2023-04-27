# April AnimeList Gallery

This is a full-stack project for an the MVP Project. Users can view, add, remove, update, and get full information about an anime. The project provides a user-friendly interface to interact with the anime gallery, allowing users to perform various operations without any basic understanding of HTTP methods like GET, POST, PATCH, and DELETE.

## Features

- View the anime gallery with a list of anime cards.
- Each card displays information such as title, image, genre, synopsis, studio, source, theme, score, and opening.
- Clicking on a listed gallery item will render a new card with detailed information.
- The edit button at the bottom of the card enables the edit mode, allowing users to modify the card's information.
- The edit button changes to a save button, and clicking on it saves the changes and rerenders the main page.
- The plus icon in the top-right corner allows users to create a new card with all the required information.
- Clicking on save after creating a new card renders back to the main page.
- Deleting a card requires selecting a specific card and prompts a confirmation popup for deletion.
- Once confirmed, the card is deleted, and the website renders back to the main page.
- Users can click on the title to go back to the main page.

## Improvements

- Ensure the title content portion is always positioned at the top.
- Implement a search feature to allow users to search for specific anime.
- Make the delete confirmation popup remain centered even when scrolling downward.

## Technologies Used

- Front-end: Javscript, HTML, CSS
- Back-end: Express
- Database: Postgres

## Installation

1. Clone the repository: `https://github.com/DessertWarrior/MVP.git`
2. Install dependencies: `npm install`
3. Start the server: `nodemon start`
4. Open the application in your browser: `http://localhost:3000` (or the appropriate URL)

## Usage

1. Browse the main page to view the anime gallery.
2. Click on an anime card to view detailed information.
3. Use the edit button to modify the card's information.
4. Click on save to apply the changes and return to the main page.
5. Click on the plus icon to create a new anime card and save it.
6. To delete a card, select the specific card and confirm the deletion in the popup.

## Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please open an issue or submit a pull request.