const render = document.getElementById('render');

class Pokemon {
  constructor() {
    this.url = 'https://pokeapi.co/api/v2/pokemon/';
    this.pokemones = [];
    this.pokemonesOriginales = [];
    this.buscador = null;
    this.extraerId();
  }
  /*
  el creo el metodo init para iniciar la aplicación.
  metodo asincrono ya que esperamos una respuesta del metodo cargarPokemones()
  */
  async init(){
    await this.cargarPokemones();
    this.mostrarDom();
    this.configurarBuscador();
  }
  //metodo para crear un array de ids 
  extraerId(){
    const ids = Array.from({length: 9}, (_, i) => i + 1);//obtenmos un array de 9 elementos del 1 al 9
    this.ids = ids;//guardamos el array ids en this.id para tener la información disponible y ocuparla en cualquier metodo
  }
  //Cargar pokemones es el metodo principal en donde hacemos las peticiones a la api y procesamos su respuesta para posteriormente manipular los datos que retorna
  async cargarPokemones(){
    try{
      const urls = this.ids.map(id => this.url + id + '/');//Creamos una constante donde almacenaremos las url con los ids, urls ahora contiene un array con las 9 urls
      const promesasFetch = urls.map(url => fetch(url));//por cada urls hacemos una peticion fetch y guardamos las promesas en un nuevo array promesasFetch = 9 promesas 1 por cada url
      const res = await Promise.all(promesasFetch);//con Promise.All resolvemos todas las promesas de una sola vez, cuando todas esten listas guardamos la respuesta en la constante res
      console.log('Urls con su id dinamico: ', urls)
      console.log('Guardamos las promesas de cada ulrs, ESTADO "PENDIENTES"', promesasFetch)
      console.log('Obtenemos la respuesta de la promesa, ESTADO "RESUELTAS" ', res);

      for(const respuesta of res){
        if(!respuesta.ok){
          throw new Error(`Fetch fallido: ${respuesta.status}`);
        }
      }

      const promesasJSON = res.map(resp => resp.json()); //promesasJSON es un array de promesas a resolver, con map creamos un nuevo array que nos devuelve una promesa
      const datosPokemon = await Promise.all(promesasJSON);//resolvemos todas las promesas
      console.log('Obtenemos un json(promesa): ', promesasJSON);
      console.log('Resolvemos la promesa y obtenemos los datos en un array de objetos: ', datosPokemon);

      //this.pokemones es igual a un array vacio y ahora le asignamos un nuevo array de objetos con la información que necesitamos id, nombre, imagen y tipos
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
    console.log('creamos un nuevo array de los pokémones con la información que necesitamos y this.pokemonesOriginales se le asigna el mismo array: ', this.pokemones)

    }catch(err){//en caso de error asignamos el array vacio en caso de haber guardado algo
      console.log('error', err);
      this.pokemones = [];
      this.pokemonesOriginales = [];
    }
  }
  
  //Metodo que selecciona el input, si no existe en el html no hace nada, sale del metodo, return
  configurarBuscador() {
    this.buscador = document.querySelector('input[placeholder="Buscar por nombre..."]');
    
    if (!this.buscador) return;
    
    //escuchamos el evento input, cualquier cambio dispara el evento
    this.buscador.addEventListener('input', (evento) => {
      //ej: input "char", evento.target.value = "char", this.pokemon("char"), filtra y re renderiza
      this.buscarPokemon(evento.target.value);
    });
  }
  /*metodo que busca que recibe un valor, en este caso es el evento.target.value, lo limpia y normaliza.
  luego filtra la lista de pokemones para mostrar solo los que contengan ese termino, si esta vacio, muestra todos los pokemon nuevamente.
  con este metodo separamos la responsabilidades, no necesitamos saber del evento
  */
  buscarPokemon(terminoBusqueda) {
    const termino = terminoBusqueda.trim().toLowerCase();//guardamos el termino de busqueda y eliminamos los espacios al principio y final .trim(), y los transformamos a minusculas
    
    if (termino === '') {//si esta vacio
      this.pokemones = [...this.pokemonesOriginales];//restauramos la lista de pokemones, si el usuario borra el termino, volvemos a tener la copia original
    } else {
      /*aca hacemos el filtrado, filter() nos entrega un array nuevo con el resultado.
      recorremos los pokemones originales le pasamos un callback y obtenemos el nombre, lo normalizamos e include() devuelve tru o false
      */
      this.pokemones = this.pokemonesOriginales.filter(pokemon => 
        pokemon.nombre.toLowerCase().includes(termino)
      );
    }
    //renderizamos this.pokemones con el el termino filtrado, si esta vacio, pokemones vuelve a tener los pokemones originales y eso es lo que renderiza this.mostrarDom()
    this.mostrarDom();
  }
  
  mostrarDom(){
    /*habran ocaciones en donde this.pokemon estara vacio, por ejemplo cuando se hace una busqueda y no se encontro una coincidencia.
    entonces hacemos esta validación, en caso de que no se llene pokemones: busqueda sin resultados, error de la api, bug en el código
    */
    if(this.pokemones.length === 0){
      render.innerHTML = `<p class="alert alert-warning">No hay Pokémon para mostrar</p>`;
      return;
    }
    /*creamos una constante en donde obtendremos las propiedades de los pokemones.
      para eso ocuparemos el map() y con notación de punto acedemos al contenido.
      el join('') nos permite unir todo, como map() nos entrega otro array de string estos estan separados por coma, 
      tambien se renderiza en el html, join('') saca esa coma y unbe todo
    */
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
              ${pokemon.tipos.map(tipo => //hacemos otro map() por que tipos esta dentro de un array de objetos
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

const pokemon = new Pokemon();//instanciamos un nuevo pokemon
pokemon.init();//iniciamos nuestra aplicación