const CountryList = ({ data }) => {
  console.log(data);
  const list = data.map(d => `<li>${d.totalCases} ${d.name}</li>`).join('');
  console.log('list', list);

  return `
    <div id="countryList" style="max-height: 90vh;">
      <h1>This is a list of countries</h1>
      <ul>
        ${list}
      </ul>
    </div>
  `;
};

export default CountryList;
