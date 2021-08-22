import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements,renderLoader,clearLoader } from './views/base';


/** Global State of the app
 * Search Object
 * Current recipe object
 * Shopping list object
 * Liked Recipies
 */
const state = {}
window.state = state;

/*<---------Search Controller------------>*/
const controlSearch = async() => {
    // 1.Get the query from view
    const query = searchView.getInput();
    


    if (query) {


        // 2.New Search object and add to state
        state.search = new Search(query);
        

        //3.Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4.Search for recipes
        try{
            await state.search.getResults();

            //5.Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(err)
        {
            alert('Error for Search.....!');
            clearLoader();
        }
        
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch(); //is an async function
});



elements.searchResPages.addEventListener('click', e =>{
  const btn = e.target.closest('.btn-inline');
  if(btn){
      const goToPage = parseInt(btn.dataset.goto,10);
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
  }
});







/*<---------Recipe Controller------------>*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    //console.log(id);

    if(id)
    {
        //prepare the UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //HighLight Selected search item
       if(state.search) searchView.highlightSelected(id);
        //create new recipe object
        state.recipe = new Recipe(id);
       
        //get Recepi data and perse ingredient
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate Serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //Render recepi
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        }
        catch(err)
        {
            alert('Error.......');
        }

       
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



/*<---------List Controller------------>*/

const controlList =()=>{
    //Create a new list if there in none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count,el.unit,el.ingredient);
    listView.renderItem(item);
    });
}


// Handling delete and update list item event
elements.shopping.addEventListener('click',e =>{
   const id = e.target.closest('.shopping__item').dataset.itemid;

   //Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *'))
    {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from Ui
        listView.deleteItem(id);

    }

    //handle the Update button
    else if(e.target.matches('.shopping__count-value'))
    {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id,val);
        
    }
});



/*<---------Like Controller------------>*/


const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    //User Has not yet liked current recipe
    if(!state.likes.isLiked(currentId)){
        //Add like to the state
          const newLike = state.likes.addLike(
             currentId,
             state.recipe.title,
             state.recipe.author,
             state.recipe.img

          );
        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to the UI list
        likesView.renderLike(newLike);
        

    }
    //User Has  liked current recipe
    else
    {
        //Remove like from the state
          state.likes.deleteLike(currentId);
        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like to the UI list
        likesView.deleteLike(currentId);
        likesView.deleteAll();

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    //Testing
    
}

//Restore liked recipes on page load
window.addEventListener('load',()=>{
    state.likes = new Likes();
    
    //Restore like
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    //Render the exixting like
    state.likes.likes.forEach(like => likesView.renderLike(like));

});




//Handling recepi button click
elements.recipe.addEventListener('click', e=>{
 if(e.target.matches('.btn-decrease, .btn-decrease *'))
 {
     //Decrese Button is clicked
     if(state.recipe.servings>1)
     {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
     }
     
 }
 else if (e.target.matches('.btn-increase, .btn-increase *'))
 {
     //Increase Button is clicked
     state.recipe.updateServings('inc');
     recipeView.updateServingsIngredients(state.recipe);
 }
 else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *'))
 {
     //Add ingredient to shobbing list
     controlList();
 }
 else if(e.target.matches('.recipe__love, .recipe__love *'))
 {
     //Like Controller
     controlLike();
 }

 //console.log(state.recipe);
});

window.l = new List();


