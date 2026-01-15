const render = document.getElementById('render');

class Pokemon {
  constructor() {
    this.url = 'https://pokeapi.co/api/v2/pokemon/';
    this.ids = this.extraerId();
    this.pokemones = [];
    this.pokemonesOriginales = [];
    this.buscador = null;
  }
  
  async init(){
    await this.cargarPokemones();
    this.mostrarDom();
    this.configurarBuscador();
  }

  extraerId(){
    const ids = [];
    for(let i = 1; i <= 371; i++){
      ids.push(i);
    }
    this.ids = ids;
    return ids;
  }

  async cargarPokemones(){
    try{
      const urls = this.ids.map(id => this.url + id + '/');
      const promesasFetch = urls.map(url => fetch(url));
      const res = await Promise.all(promesasFetch);

      for(const respuesta of res){
        if(!respuesta.ok){
          throw new Error(`Fetch fallido: ${respuesta.status}`);
        }
      }

      const promesasJSON = res.map(resp => resp.json());
      const datosPokemon = await Promise.all(promesasJSON);

      this.pokemones = datosPokemon.map(pokemones =>{
        return {
          id: pokemones.id,
          nombre: pokemones.name,
          imagen: pokemones.sprites?.other?.['official-artwork']?.front_default 
                 || pokemones.sprites.front_default,
          tipos: pokemones.types.map(t => t.type.name)
        }
      });
      
      this.pokemonesOriginales = [...this.pokemones];

    }catch(err){
      console.log('error', err);
      this.pokemones = [];
      this.pokemonesOriginales = [];
    }
  }
  
  configurarBuscador() {
    this.buscador = document.querySelector('input[placeholder="Buscar por nombre..."]');
    
    if (!this.buscador) return;
    
    this.buscador.addEventListener('input', (evento) => {
      this.buscarPokemon(evento.target.value);
    });
  }
  
  buscarPokemon(terminoBusqueda) {
    const termino = terminoBusqueda.trim().toLowerCase();
    
    if (termino === '') {
      this.pokemones = [...this.pokemonesOriginales];
    } else {
      this.pokemones = this.pokemonesOriginales.filter(pokemon => 
        pokemon.nombre.toLowerCase().includes(termino)
      );
    }
    
    this.mostrarDom();
  }
  
  mostrarDom(){
    if(this.pokemones.length === 0){
      render.innerHTML = `<p class="alert alert-warning">No hay Pokémon para mostrar</p>`;
      return;
    }

    const cards = this.pokemones.map(pokemon=>{
      return `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow">
          <img src="${pokemon.imagen}" class="card-img-top p-3" alt="${pokemon.nombre}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title text-capitalize mb-0">${pokemon.nombre}</h5>
              <span class="text-muted">#${pokemon.id.toString().padStart(3, '0')}</span>
            </div>
            <div class="mt-2">
              ${pokemon.tipos.map(tipo => 
                `<span class="badge bg-primary me-1">${tipo}</span>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');

    render.innerHTML =`
    <div class="container mt-4">
        <div class="row">
          ${cards}
        </div>
      </div>
    `;
  }
}

const pokemon = new Pokemon();
pokemon.init();