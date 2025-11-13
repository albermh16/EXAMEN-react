function InputBox(props) {

  console.log(`valores recibidos desde el componente padre: ${JSON.stringify(props)}`);

  return (
              <div className="mb-3">
                <label htmlFor={props.nameInput} className="form-label">
                  {props.labelInput} <span className="text-danger">*</span>
                </label>
                <input
                  type={props.tipoInput}
                  className="form-control"
                  id={props.nameInput}
                  name={props.nameInput}
                  placeholder={props.nameInput || `Introduce tu(s) ${props.nameInput}`}
                  onChange={props.eventoOnChange}
                  required
                />
                {/* ...errroes de validacion si los hubiera...
                    <div className="invalid-feedback">Introduce tu nombre.</div>
                */}
              </div>  
  )
}

export default InputBox;