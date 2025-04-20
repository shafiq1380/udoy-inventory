import React, { useEffect, useState } from 'react';
import Checkbox from './Checkbox';

const NestedItem = ({ item, onCheck, isChecked, items }) => {

    const [checked, setChecked] = useState(isChecked || items?.includes(item.id) || false);

    const handleCheck = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        onCheck(item.id, newChecked);
    };


    useEffect(() => {

    }, [])


    return (
        <div className='m-2'>
            {
                !item.subMenuList &&
                // <Checkbox checked={checked} onChange={() => onCheck(item.id)} />
                <Checkbox checked={checked} onChange={handleCheck} />
            }
            <span className={`${item.menuHeader || item.subMenu ? "text-primary" : ''}`}>{item.menuHeader || item.title}</span>
            {item.subMenuList?.map((child) => (
                <NestedItem key={child.id} item={child} onCheck={onCheck} isChecked={checked} items={items} />
            ))}

        </div>
    );
};

export default NestedItem;
