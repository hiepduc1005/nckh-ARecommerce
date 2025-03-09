import React from 'react'
import '../assets/styles/components/CheckBoxList.scss'
const CheckBoxList = ({title,listCheckBox,setSelect,selected}) => {
    const handleSelect = (checkbox, isChecked) => {
        setSelect((prev) => 
          isChecked ? [...prev, checkbox] : prev.filter((item) => item.id !== checkbox.id)
        );
      };
  return (
    <div className='checkbox-container'>
        <h3 className='title'>{title}</h3>
        {listCheckBox?.map((checkbox, index) => (
            <label key={index} className='checkbox-item'>
                <input 
                    type="checkbox" 
                    checked={selected?.some((item) => item.id === checkbox.id)} 
                    onChange={(e) => handleSelect(checkbox,e.target.checked)}
                />
                <span className="checkbox-label">{checkbox.name}</span>
            </label>
        )) }
    </div>
  )
}

export default CheckBoxList