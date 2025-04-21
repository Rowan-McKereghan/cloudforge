import { useState } from 'react';
import axios from 'axios';
import { Material } from '../App';
import SelectUnits from './SelectUnits';

interface Props {
  onMaterialAdded: () => void;
}

export default function AddMaterial({onMaterialAdded}: Props) {
  const defaultForm: Material = {name: '', grade: '', length: 0, width: 0, thickness: 0, 
  defaultPrice: 0, lengthUnits: 'in', widthUnits: 'in', thicknessUnits: 'in', priceUnits: 'CWT'};

  const [formData, setFormData] = useState<Material>({...defaultForm});

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      axios.post('http://localhost:3000/materials', formData).then((res) => {
          if(res.status === 201) {
            setFormData({...defaultForm});
            onMaterialAdded();
          }
        }
      ).catch((error) => console.log(error));
    };

  const options = ["in", "ft", "mm", "cm", "m", "gauge"];
  const priceUnitOptions = ["CWT", "lb", "ft", "piece"];

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Material</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Material Name
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Grade
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          />
        </div>

        <div className='flex'>
          <div className='w-full mr-2'><label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Length
          </label>
          <input
            type="number"
            step="0.001"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value)})}
          /></div>

          <SelectUnits options={options} value={formData.lengthUnits} id="length"
          onChange={(e) => setFormData({ ...formData, lengthUnits: e.target.value})}></SelectUnits>
          
          <div className='w-full ml-8 mr-2'><label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Width
          </label>
          <input
            type="number"
            step="0.001"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) })}
          /></div>

          <SelectUnits options={options} value={formData.widthUnits} id="width"
          onChange={(e) => setFormData({ ...formData, widthUnits: e.target.value})}></SelectUnits>

          <div className='w-full ml-8 mr-2'><label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Thickness
          </label>
          <input
            type="number"
            step="0.001"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.thickness}
            onChange={(e) => setFormData({ ...formData, thickness: parseFloat(e.target.value) })}
          /></div>

        <SelectUnits options={options} value={formData.thicknessUnits} id="thickness"
          onChange={(e) => setFormData({ ...formData, thicknessUnits: e.target.value})}></SelectUnits>
        </div>

        <div className='flex'>
          <div className='w-full mr-6'>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Default Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.defaultPrice}
              onChange={(e) => setFormData({ ...formData, defaultPrice: parseFloat(e.target.value) })}
            />
          </div>

          <div className='mt-7 mr-6'>
            <span>
              per
            </span>
          </div>

          <SelectUnits options={priceUnitOptions} value={formData.priceUnits} id="price"
          onChange={(e) => setFormData({ ...formData, priceUnits: e.target.value })}/>

        </div>
        

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
        >
          Add Material
        </button>
      </form>
    </div>
  );
}