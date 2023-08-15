import fs from 'fs';

export const updateTime = () => {
  const getFileUpdatedDate = (path) => {
    // eslint-disable-next-line no-sync
    const stats = fs.statSync(path);
    return stats.mtime;
  };

  const verDate = new Date(getFileUpdatedDate('./src/js/settings/version.js'));

  const mon = getMonth(verDate);
  const day = verDate.getDate();
  const year = verDate.getUTCFullYear();
  const dateStr = `${mon} ${day}, ${year}`;

  const content = `// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\nexport const VERSION_DATE = '${dateStr}';\n`;

  fs.writeFile('./src/js/settings/versionDate.js', content, 'utf8', (err) => {
    if (err) throw err;
  });
};

const getMonth = (verDate) => {
  switch (verDate.getMonth()) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
    default:
      return 'Unknown';
  }
};
