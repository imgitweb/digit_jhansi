// import React from 'react';
// import Transition from '../../utils/Transition';

// export default function ResourceDetailModal({ isOpen, onClose, resource }) {
//   const DetailRow = ({ label, value }) => (
//     <div className="flex py-2 border-b border-gray-100 dark:border-gray-700/40 last:border-0">
//       <span className="w-1/3 text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</span>
//       <span className="w-2/3 text-sm text-gray-800 dark:text-gray-200">{value || '-'}</span>
//     </div>
//   );

//   return (
//     <>
//       <Transition
//         unmountOnExit={true}
//         className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity"
//         show={isOpen}
//         enter="transition ease-out duration-200"
//         enterStart="opacity-0"
//         enterEnd="opacity-100"
//         leave="transition ease-out duration-100"
//         leaveStart="opacity-100"
//         leaveEnd="opacity-0"
//         aria-hidden="true"
//       />
//       <Transition
//         unmountOnExit={true}
//         className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center px-4 sm:px-6"
//         role="dialog"
//         aria-modal="true"
//         show={isOpen}
//         enter="transition ease-in-out duration-200"
//         enterStart="opacity-0 translate-y-4"
//         enterEnd="opacity-100 translate-y-0"
//         leave="transition ease-in-out duration-200"
//         leaveStart="opacity-100 translate-y-0"
//         leaveEnd="opacity-0 translate-y-4"
//       >
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700/60">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/60 flex justify-between items-center">
//             <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Resource Profile</h2>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-500">&times;</button>
//           </div>
          
//           <div className="overflow-y-auto flex-1 p-6">
//             <div className="mb-6 flex justify-between items-start">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{resource?.fullName || ''}</h3>
//                 <p className="text-sm text-violet-500 font-medium">{resource?.resourceId || ''}</p>
//               </div>
//               <div className="text-right">
//                 <span className="text-xs text-gray-500 block mb-1">Registered: {resource?.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'N/A'}</span>
//                 <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-sm">{resource?.registrationSource || 'Unknown Source'}</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 bg-gray-50 dark:bg-gray-900/20 py-1 px-2 rounded-sm border-l-2 border-violet-500">Basic Info</h4>
//                 <DetailRow label="Phone" value={resource?.phoneNumber} />
//                 <DetailRow label="Email" value={resource?.email} />
//                 <DetailRow label="Gender" value={resource?.gender} />
//                 <DetailRow label="Age/DOB" value={`${resource?.age || '-'} / ${resource?.dateOfBirth ? new Date(resource.dateOfBirth).toLocaleDateString() : '-'}`} />
//                 <DetailRow label="Status" value={resource?.status} />
//               </div>
              
//               <div>
//                 <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 bg-gray-50 dark:bg-gray-900/20 py-1 px-2 rounded-sm border-l-2 border-violet-500">Location</h4>
//                 <DetailRow label="Full Address" value={resource?.address?.fullAddress} />
//                 <DetailRow label="Village/Ward" value={resource?.address?.village} />
//                 <DetailRow label="Block" value={resource?.address?.block} />
//                 <DetailRow label="District & State" value={`${resource?.address?.district || '-'}, ${resource?.address?.state || '-'}`} />
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 bg-gray-50 dark:bg-gray-900/20 py-1 px-2 rounded-sm border-l-2 border-violet-500">Professional</h4>
//                 <DetailRow label="Primary Skill" value={`${resource?.skills?.primary?.name || '-'} (${resource?.skills?.primary?.level || '-'})`} />
//                 <DetailRow label="Secondary Skill" value={`${resource?.skills?.secondary?.name || '-'} (${resource?.skills?.secondary?.level || '-'})`} />
//                 <DetailRow label="Tertiary Skill" value={`${resource?.skills?.tertiary?.name || '-'} (${resource?.skills?.tertiary?.level || '-'})`} />
//                 <DetailRow label="Employment Status" value={resource?.employment?.currentStatus} />
//                 <DetailRow label="Job Role" value={resource?.employment?.jobRole} />
//                 <DetailRow label="Experience" value={`${resource?.employment?.yearsOfExperience || 0} yrs`} />
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 bg-gray-50 dark:bg-gray-900/20 py-1 px-2 rounded-sm border-l-2 border-violet-500">Education & Digital</h4>
//                 <DetailRow label="Highest Qual." value={resource?.education?.highestQualification} />
//                 <DetailRow label="Degree/Spec." value={`${resource?.education?.degreeName || '-'} / ${resource?.education?.specialization || '-'}`} />
//                 <DetailRow label="Institution" value={resource?.education?.collegeUniversity} />
//                 <DetailRow label="Digital Literacy" value={resource?.digitalProfile?.digitalLiteracyLevel} />
//                 <DetailRow label="Languages" value={resource?.digitalProfile?.languagesKnown?.join(', ')} />
//               </div>
              
//               <div className="md:col-span-2">
//                 <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 bg-gray-50 dark:bg-gray-900/20 py-1 px-2 rounded-sm border-l-2 border-violet-500">Preferences & Notes</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//                   <DetailRow label="Interests" value={resource?.interests?.filter(Boolean).join(', ')} />
//                   <DetailRow label="Work Type" value={resource?.workPreference?.preferredWorkType} />
//                   <DetailRow label="Availability" value={resource?.workPreference?.availability} />
//                   <DetailRow label="Willing to Relocate" value={resource?.flags?.willingToRelocate ? 'Yes' : 'No'} />
//                   <DetailRow label="Willing for Training" value={resource?.flags?.willingForTraining ? 'Yes' : 'No'} />
//                   <DetailRow label="Notes" value={resource?.notes} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Transition>
//     </>
//   );
// }