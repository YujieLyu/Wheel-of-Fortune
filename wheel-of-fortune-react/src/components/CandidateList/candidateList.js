import React from 'react';
import './candidateList.scss';

const CandidateList = ({ allList, pieList, handleChange, handleClick }) => {
    return allList.length > 0 ? (
        allList.map(eleInAll =>
            <div key={eleInAll.id} className='candidate-list'>
                <div>
                    <input type="checkbox"
                        checked={pieList.filter(e => e.name === eleInAll.name).length > 0}
                        onChange={() => { handleChange(eleInAll) }} >
                    </input>
                    <label htmlFor={eleInAll.id}>{eleInAll.name}</label>
                </div>
                <div className="delete"
                    onClick={() => handleClick(eleInAll,
                        pieList.find(eleInPie => eleInPie.name === eleInAll.name))}>x</div>
            </div>
        )) : (<div>
            Loading...
        </div>)
}
export default CandidateList