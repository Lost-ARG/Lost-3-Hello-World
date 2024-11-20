const xlsx = require('xlsx');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const { teamRank } = require('../service/database/teamService');

function formatTimestamp(timestamp) {
  return dayjs(timestamp).utc("Z").format('YYYY-MM-DD HH:mm:ss');
}

const teams = async (req, res) => {
  try {
    const rank = await teamRank();
    // Convert data to a format suitable for Excel
    const excelData = rank.map(team => {
      // Initialize the level columns from Level_0 to Level_18
      const levels = Array.from({ length: 19 }, (_, i) => {
        // Default all levels to null
        const levelData = team.game_progress.find(gp => gp.level === i);
        return levelData ? levelData.timestamp : null;
      });

      return {
        Name: team.name,
        Code: team.code,
        Score: team.score,
        LastLevel: team.lastGameProgress.level,
        LastTimestamp: formatTimestamp(team.lastGameProgress.timestamp),
        Member1: `${team.members.member_1?.name || ''} (${team.members.member_1?.id || ''}) - ${team.members.member_1?.email || ''}`,
        Member2: `${team.members.member_2?.name || ''} (${team.members.member_2?.id || ''}) - ${team.members.member_2?.email || ''}`,
        Member3: `${team.members.member_3?.name || ''} (${team.members.member_3?.id || ''}) - ${team.members.member_3?.email || ''}`,
        ...levels.reduce((acc, timestamp, index) => {
          // Set level column names dynamically (Level_0, Level_1, ..., Level_18)
          acc[`Level_${index}`] = timestamp ? formatTimestamp(timestamp) : ''; // Default null values to empty strings
          return acc;
        }, {})
      };
    });

    // Create a new workbook
    const wb = xlsx.utils.book_new();

    // Create a worksheet from the data
    const ws = xlsx.utils.json_to_sheet(excelData);


    // Adjust column widths based on the longest string in each column
    const colWidths = Object.keys(ws).reduce((widths, cell) => {

      const col = cell.replace(/\d/g, ''); // Get column (e.g., A, B, etc.)
      const cellValue = !(typeof ws[cell] === "string") ? ws[cell].v : ''; // Handle null or undefined safely
      const cellLength = cellValue.toString().length;

      if (!widths[col] || cellLength > widths[col]) {
        widths[col] = cellLength; // Set max length for each column
      }

      return widths;
    }, {});

    // Set the column widths
    ws['!cols'] = Object.keys(colWidths).map(col => ({
      wpx: colWidths[col] * 10 // Multiply by 10 to give some padding space
    }));

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, 'Team Rankings');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="teams_${dayjs().utc("Z").format('YYYY_MM_DD_HH_mm_ss')}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    throw new Error(`Get Team Rank Failed, Error: ${error.message}`);
  }
};

module.exports = {
  teams,
}

