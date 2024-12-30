# BrewVault

I opted for an Angular app since is the main framework I've been working in recent years. I also used PrimeNG, a framework of Angular components to help in the elements display.

This app consists of a list of Beers fetched from an API. In this list the user has two view options (list and grid) and he also has the possibility to filter beers by type, and sort them by name or date.

The user can also access the Detail view for each beer by clicking on it.

The user can create is own collection of beers by clicking in the "heart" icon visible in each list item. The collection is saved in the browser's localStorage and can be accessed in the top right menu.

The user can add new Beers to the database so I chose to try to integrate a Knockout component within Angular. The form for creating new Beers is a Knockout component inside an iframe that comunicates to the Angular app each time it tries to create a new Beer. Then the Angular app handles all the next steps such as success/errors notifications and routing.

## Images

The https://mockapi.io/ API was generating always the same image for every beer so I used Faker.js to generate the images for the base DB. In the first run a request is made using Faker.js to get an image for each beer in the API. After that, those images are saved in localStorage and loaded from there when needed. The new beers created by the user include an image URL and that image will not be replaced by the Faker.js request.

## Name and Logo

I asked ChatGPT for some site names related with beer collections and then I required a logo for the name I picked.

## Run the App

- Node v18.19.0 needed (might work with newer versions)

After cloning the project we need to run `npm install`. After all the packages are installed we run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
