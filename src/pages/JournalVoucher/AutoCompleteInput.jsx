import React, { useEffect, useState } from 'react'
import Select from 'react-select';

const AutoCompleteInput = ({ handleSelect, selectedOption, innerRef, options }) => {

    const fixedoptions = [
        { value: '100100210001 - Cash in Hand', label: '100100210001 - Cash in Hand' },
        { value: '100100210003 - XYZ', label: '100100210003 - XYZ' },
        { value: '100100210004 ABC', label: '100100210004 ABC' },
        { dfsa: '100100210004 ABC', fasd: '100100210004 ABC' },
    ];

    const [optionsData, setOptionData] = useState([])


    const formatData = () => {
        const data = options?.map(item => {
            return {
                value: item.bankCode,
                label: item.bankCode
            }
        })
        setOptionData(data)
    }


    useEffect(() => {
        formatData()
    }, [])

    return (
        < div className="App">
            <Select
                value={selectedOption || 'select...'}
                onChange={handleSelect}
                options={options ? optionsData : fixedoptions}
                placeholder={selectedOption?.length > 0 ? selectedOption : 'select...'}
            />
        </div>
    )
}

export default AutoCompleteInput

