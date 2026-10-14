/**
 * Downloads a pre-built static Excel template from /public/templates/.
 * Uses native anchor-click — no external library required.
 */
const downloadTemplate = (fileName) => {
    const link = document.createElement('a');
    link.href = `/templates/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const downloadResourceTemplate         = () => downloadTemplate('Resource_Hub_Template.xlsx');
  export const downloadRiderTemplate            = () => downloadTemplate('Riders_Database_Template.xlsx');
  export const downloadEnablerTemplate          = () => downloadTemplate('Ecommerce_Enablers_Template.xlsx');
  export const downloadIndustryUnder50LTemplate = () => downloadTemplate('Industry_Pool_Under50L_Template.xlsx');
  export const downloadIndustry50LPlusTemplate  = () => downloadTemplate('Industry_Pool_50L_Plus_Template.xlsx');
  export const downloadInstitutionTemplate      = () => downloadTemplate('Institutions_Template.xlsx');