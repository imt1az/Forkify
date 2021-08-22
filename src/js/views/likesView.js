import { elements } from './base';
import {limitRecepiTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    // icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes =>{
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like =>{
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
                                <img src="${like.img}" alt="${like.title}">
                                </figure>
                                <div class="likes__data">
                                    <h4 class="likes__name">${limitRecepiTitle(like.title)}</h4>
                                    <p class="likes__author">${like.author}</p>
                                </div>
        </a>                                            
    </li>
    
   `;
   elements.likesList.insertAdjacentHTML('beforeend',markup);
};

export const deleteLike = id =>{
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(el) el.parentElement.removeChild(el);
}

//Delete All

export const deleteAll = () =>{
    var btn = document.getElementById( 
        "btn").onclick = function() { 
            deleteChild(); 
        }

        function deleteChild() { 
            var e = document.querySelector('.likes__list'); 
            
            //e.firstElementChild can be used. 
            var child = e.lastElementChild;  
            while (child) { 
                e.removeChild(child); 
                child = e.lastElementChild; 
            } 
        } 
}