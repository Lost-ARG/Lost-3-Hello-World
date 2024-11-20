const teams = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("/api/statistic/teams", requestOptions)
  .then(async (response) => {
    const contentDisposition = response.headers.get('Content-Disposition');
    console.log('Content-Disposition:', contentDisposition);

    let filename = 'teams.xlsx';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }
    console.log('Filename:', filename);

    const blob = await response.blob();
    return ({ blob, filename });
  })
  .then(({ blob, filename }) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  })
  .catch((error) => console.error('Error:', error));
}

const statisticTypeMap = {
  "teams": teams
}

const getStatistic = (statisticType) => {
  statisticTypeMap[statisticType]();
}
