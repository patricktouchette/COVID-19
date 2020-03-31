const CountryList = ({ data }) => {
  const list = data
    .map((d, index) => {
      const html = `
        <li data-index="${index}">
          <strong>${d.totalCases.toLocaleString()}</strong>
          ${d.name} 
          <em>(${d.newCases.toLocaleString()})</em>
        </li>
      `;
      return html;
    })
    .join('');

  return `
    <div id="countryList" >
      <h2>Confirmed Cases by Country</h2>
      <p><strong>Total</strong> Country <em>(New Today)</em>
      <ul class="countryList">
        ${list}
      </ul>
    </div>
  `;
};

export default CountryList;
