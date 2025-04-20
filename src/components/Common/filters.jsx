import React from 'react';
import { Input } from 'reactstrap';

export const Filter = ({ column }) => {
  return (
    <div >
      {column.canFilter && column.render('Filter')}
    </div>
  );
};

export const DefaultColumnFilter = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input
      className='p-1'
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search (${length}) ...`}
    />
  );
};

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // console.log(options)

  return (
    <select
      // style={{ marginBottom: '10px' }}
      id='custom-select'
      className="form-select p-1 mb-2"
      value={filterValue}
      onChange={(e) => {
        // console.log(e.target.value)
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {/* {option} */}
          {option === 1 ? 'Active' : option === 0 ? 'Inactive' : option === -2 ? 'Not Assigned' : option === true ? 'Active' : option === false ? 'Inactive' : option}
        </option>
      ))}
    </select>
  );
};


export const CustomColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      id='custom-select'
      style={{ marginBottom: '10px', paddingTop: '4px', paddingBottom: '4px', textAlign: 'start' }}
      className="form-select"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>All</option>
      {
        options.map((option) => (
          <option key={option} value={option} >
            {/* {option} */}
            {option === 1 ? 'Save' : option === 2 ? 'Post' : option}
          </option>
        ))
      }
    </select >
  );
};



/// Dynamic  for filter value 
export const SelectDynamicColumnFilter = ({
  column: { Header, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  const filterOption = options.filter(title => Object.keys(title).length > 0);

  return (
    <select
      id='custom-select'
      className="form-select p-1"
      // value={Header}
      onChange={(e) => {
        // console.log(typeof (e.target.value))
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>All</option>
      {filterOption.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};