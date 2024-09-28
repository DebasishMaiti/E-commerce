import React from 'react'

const CategoryForm = ({ handleSubmit, value, setValue }) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text" className="form-control mb-3" placeholder='Enter new Category' value={value} onChange={(e) => setValue(e.target.value)} />
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
        </>
    )
}

export default CategoryForm
