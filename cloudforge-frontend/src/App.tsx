import { useEffect, useState } from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import ProductCatalog from './ProductCatalog';
import QuoteBuilder from './QuoteBuilder';

export interface Material {
  id?: string,
  name: string, 
  grade: string, 
  length: number,
  width: number,
  thickness: number,
  defaultPrice: number,
  lengthUnits: string,
  widthUnits: string,
  thicknessUnits: string,
  priceUnits: string,
  inventory?: Inventory
}

export interface PurchaseHistory {
  id: string;
  quantity: number;
  vendor?: string;
  date: string;
  inventoryId: string;
}

export interface Inventory {
  id: string;
  onHand: number;
  allocated: number;
  purchases: PurchaseHistory[];
}

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  // const [inventory, setInventory] = useState<Inventory[]>([]);
  const getAndSetMats = () => {
    axios.get(import.meta.env.LIVE_URL + '/materials').then((res) => {
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductCatalog materials={materials} getAndSetMats={getAndSetMats}/>} />
        <Route path="/quotes" element={<QuoteBuilder getAndSetMats={getAndSetMats}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;