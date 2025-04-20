interface Props {
    value: number | string
    onChange: (e: any) => void
    options: string[]
    id: string
}


export default function SelectUnits({value, id, onChange, options}: Props) {

    return (
        <div className='mt-6'>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700"></label>
            <select
              id={id}
              className="block px-6 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-base bg-none"
              value={value}
              onChange={onChange}>

              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
    )

} 