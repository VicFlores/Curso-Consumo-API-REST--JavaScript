const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const spanError = document.getElementById('error');

const API_KEY = 'b0e6067e-e3d4-4890-9840-9b33b120f5d0';

const baseURL = (props) => {
  return `https://api.thecatapi.com/v1/${props}`;
};

async function loadRandomMichis() {
  const response = await fetch(baseURL('images/search/?limit=3&'));
  const data = await response.json();

  if (response.status !== 200) {
    spanError.innerHTML = `Hubo un error ${response.status}`;
  } else {
    img1.src = data[0].url;
    img2.src = data[1].url;
    img3.src = data[2].url;

    btn1.onclick = () => saveFavouriteMichis(data[0].id);
    btn2.onclick = () => saveFavouriteMichis(data[1].id);
    btn3.onclick = () => saveFavouriteMichis(data[2].id);
  }
}

async function loadFavouriteMichis() {
  const res = await fetch(baseURL('favourites'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
  } else {
    const section = document.getElementById('favoritesMichis');
    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode('Michis favoritos');
    section.innerHTML = '';
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.map((michi) => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const button = document.createElement('button');
      const buttonText = document.createTextNode('Remover Michi');

      img.src = michi.image.url;
      img.width = 250;
      img.height = 350;
      button.appendChild(buttonText);
      button.onclick = () => deleteFavouriteMichis(michi.id);
      article.appendChild(img);
      article.appendChild(button);
      section.appendChild(article);
    });
  }
}

async function saveFavouriteMichis(id_michi) {
  const res = await fetch(baseURL('favourites'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      image_id: id_michi,
    }),
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
  } else {
    console.log('Michi guardado en favoritos');
    loadFavouriteMichis();
  }
}

async function deleteFavouriteMichis(id_michi) {
  const res = await fetch(baseURL(`favourites/${id_michi}?`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
  } else {
    console.log('Michi Eliminado');
    loadFavouriteMichis();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById('uploadFormMichi');
  const formData = new FormData(form);
  const res = await fetch(baseURL('images/upload'), {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
    },
    body: formData,
  });

  const data = await res.json();

  console.log(formData.get('file'));

  if (res.status !== 201) {
    spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
  } else {
    console.log('Michi Foto subida :P');
    console.log({ data });
    console.log(data.url);
    saveFavouriteMichis(data.id);
  }
}
loadRandomMichis();
loadFavouriteMichis();
