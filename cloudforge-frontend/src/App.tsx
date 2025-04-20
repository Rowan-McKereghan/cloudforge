import { useEffect, useState } from 'react';
import axios from 'axios';
import AddMaterial from './components/AddMaterial';
import ManageInventory from './components/ManageInventory';

export interface Material {
  id: string,
  name: string, 
  grade: string, 
  length: number,
  width: number,
  thickness: number,
  defaultPrice: number,
  lengthUnits: string,
  widthUnits: string,
  thicknessUnits: string,
  priceUnits: string
  inventory?: Inventory
}

export interface Inventory {
  id: string,
  onHand: number,
  allocated: number
}

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);

  const getAndSetMats = () => {
    axios.get('http://localhost:3000/materials').then((res) => {
      let temparr: Material[] = [];
      res.data.map((material: Material) => {
        temparr.push({
          "id": material.id,
          "name": material.name,
          "grade": material.grade,
          "length": material.length,
          "width": material.width,
          "thickness": material.thickness,
          "defaultPrice": material.defaultPrice,
          "lengthUnits": material.lengthUnits,
          "widthUnits": material.widthUnits,
          "thicknessUnits": material.thicknessUnits,
          "priceUnits": material.priceUnits,
          "inventory": material.inventory
          });
        });
      setMaterials(temparr);
    }).catch((error) => console.log(error));
  }

  useEffect(() => {
    getAndSetMats();
  }, []);


  return (
    <div className="p-8 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Metal Service Center Dashboard</h1>
      
      <nav className="mb-8">
        <button className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900">
          Product Catalog
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
          Quotes
        </button>
      </nav>

      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">Material</th>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">Grade</th>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">Length</th>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">Width</th>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">Thickness</th>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">Default Price</th>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">On Hand</th>
              <th className="px-6 py-3 text-left text-gray-900 dark:text-gray-100">Allocated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {materials.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{material.name}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{material.grade}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{material.length + " " + material.lengthUnits}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{material.width + " " + material.widthUnits}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{material.thickness + " " + material.widthUnits}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{"$" + material.defaultPrice + " per " + material.priceUnits}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {material.inventory?.onHand}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {material.inventory?.allocated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddMaterial onMaterialAdded={getAndSetMats}/>
      </div>
      <ManageInventory materials={materials} onInventoryUpdated={getAndSetMats}/>
    </div>
  );
}

export default App;