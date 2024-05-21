const AddItemMask = ({ parentCallback, show, postItem, isOwner, options}) => {
  const button = (
    <button
      className="createItem noSelect"
      onClick={() => {
        parentCallback(true);
      }}
    >
      {" "}
      Add Item
    </button>
  );
  // show = true
  if (!show) {
    return isOwner ? button : '';
  } else {
    return (
      <>
        {button}
        <div className="hiddenPanel">
          <div
            className="mask"
            onClick={() => {
              parentCallback(false);
            }}
          ></div>
          <div className="hiddenContainer">
            <h2>Add Item</h2>
            <form className="wideForm">
              <label className="wrap">
                Item Name:
                <input type="text" name="itemName" id="itemName" required />
              </label>
              <label className="wrap">
                Url:
                <input type="url" name="url" id="url" />
              </label>
              <label className="wrap">
                Color: <input type="text" name="color" id="color" />
              </label>
              <label className="wrap">
                Size: <input type="text" name="size" id="size" />
              </label>
              <div className="options">
                <h3 className="catLabel">Category</h3>
                <div id='options'>
                {options.map((opt, idx) => {
                  return <label className="check" key={`${opt}${idx}`}>
                    <input type="checkbox" name={opt.toLowerCase()} id={opt.toLowerCase()} /> {opt}
                  </label>
                })}
                </div>
                {/* <label className="check">
                  <input type="checkbox" name="clothes" id="clothes" /> Clothes
                </label>
                <label className="check">
                  <input type="checkbox" name="electronics" id="electronics" />
                  Electronics
                </label>
                <label className="check">
                  <input type="checkbox" name="games" id="games" /> Games
                </label>
                <label className="check">
                  <input type="checkbox" name="other" id="other" /> Other
                </label>
                <label className="check">
                  <input type="checkbox" name="outside" id="outside" /> Outside
                </label> */}
              </div>
              <button
                type="submit"
                className="submit"
                onClick={(e) => {
                  let form = document.querySelectorAll("input");
                  postItem(e, form);
                }}
              >
                Add Item
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
};
export default AddItemMask;
