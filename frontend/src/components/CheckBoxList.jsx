import React from 'react'
import '../assets/styles/components/CheckBoxList.scss'
const CheckBoxList = ({title,listCheckBox,setSelect,selected,loading}) => {
    

  console.log(loading)
   
    const handleSelect = (checkbox) => {
      if(loading) return ;


      const isChecked = selected.some((item) => item.id === checkbox.id);
      const data = isChecked ? selected.filter((item) => item.id !== checkbox.id) : [...selected, checkbox]

      setSelect(data);
    };

  return (
    <div className='checkbox-container'>
        <h3 className='title'>{title}</h3>
        {listCheckBox?.map((checkbox, index) => (
            <label key={index} className='checkbox-item'>
                <input 
                    type="checkbox" 
                    checked={selected?.some((item) => item.name === checkbox.name)} 
                    onChange={(e) => handleSelect(checkbox)}
                    disabled={loading}
                />
                <span className="checkbox-label">{checkbox.name}</span>
            </label>
        )) }
    </div>
  )
}

export default CheckBoxList