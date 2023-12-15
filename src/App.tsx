import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTrash } from 'react-icons/fi';
import { api } from './services/api'


interface WinesProps{
  _id: string;
  name: string;
  safra: number;
  status: boolean;
  created_at: string;
}


export default function App() {


  const [wines, setWines] = useState<WinesProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null);
  const safraRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadWines();
  }, [])

 async function loadWines() {
    const response = await api.get("/wines")
    setWines(response.data);
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    if(!nameRef.current?.value || !safraRef.current?.value) return;

    const response = await api.post("/wines", {
      name: nameRef.current.value,
      safra: safraRef.current?.value
    })

    setWines(allWines => [...allWines, response.data])

  }


  async function handleDelete(id: string) {
    try {
      await api.delete("/wines", {
        params:{
          id: id,
        }
      })

      const allWines = wines.filter( (wine) => wine._id !== id )
      setWines(allWines)
    } catch (err) {
      console.log(err)
    }   
  }


  return (
    <div className="w-full min-h-screen bg-rose-950 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Nossos Vinhos</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome do Vinho:</label>
          <input
            type="text"
            placeholder="Digite o nome do vinho..."
            className="w-full mb-5 p-2 rounded" 
            ref={nameRef}          
          />

          <label className="font-medium text-white">Safra:</label>
          <input
            type="number"
            placeholder="Digite o ano do vinho..."
            className="w-full mb-5 p-2 rounded" 
            ref={safraRef}           
          />

          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-800 rounded font-medium text-white"
          />
        </form>

        <section className="flex flex-col gap-4">


        {wines.map((wine) => (       
            <article
            key={wine._id}
            className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
            >
              <p><span className="font-medium">Nome do Vinho:</span> {wine.name}</p>
              <p><span className="font-medium">Safra:</span> {wine.safra}</p>
              <p><span className="font-medium">Status:</span> {wine.status ? "EM ESTOQUE" : "EM FALTA"}</p>
  
              <button
              className='bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2'
              onClick={() => handleDelete(wine._id)}
              >
                <FiTrash size={18} color="#FFF" />
              </button>
            </article>
        ))}        

        </section>
        
      </main>
    </div>
  );
}
