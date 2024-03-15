document.addEventListener('DOMContentLoaded', ()=>{

  const getItems = ()=>{
    return fetch('/items')
      .then((response)=>response.json())
      .then((data)=>{
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';
        for(const entry of data){
          const newDiv = document.createElement('div');
          newDiv.className = 'item';
          newDiv.innerHTML = `<p>${entry.description}</p><p>$${entry.price}</p><button class="purchase" itemid=${entry.id}>Purchase this item</button>`;
          const btn = newDiv.querySelector('.purchase');
          btn.addEventListener('click', ()=>{
            const itemid = btn.getAttribute('itemid');
            purchaseItem(itemid)
              .then((purchasedItem)=>{
                if(typeof purchasedItem == 'string')
                  console.warn(purchasedItem);
                else{
                  btn.parentNode.remove();

                }
              });
          });
          itemList.appendChild(newDiv);
        }
      });
  };
  getItems();

  const purchaseItem = (id)=>{
    return fetch('/items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({id: id})
    })
      .then((response)=>response.json())
      .then((purchasedItem)=>{
        return purchasedItem;
      });

  };

  const postItem = (desc, price)=>{
    return fetch('/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        description: desc,
        price: price
      })
    })
      .then((response)=>response.json())
      .then((postedItem)=>{
        if(typeof postedItem == 'string')
          console.warn(postedItem);
        getItems(); 
      });

  };

  const listBtn = document.getElementById('list-item');
  listBtn.addEventListener('click', ()=>{
    const description = document.getElementById('item');
    const price = document.getElementById('price');
    postItem(description.value, price.value).then(()=>{
      description.value = '';
      price.value = '';
    });
  });
});
