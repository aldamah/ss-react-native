import constants from './constants'

export default API =
        {
            login:  `${constants.apiUrl}/sessions`,
            patchUserLang:  `${constants.apiUrl}/users/`,
            getUserLang:  `${constants.apiUrl}/sessions/me`,

            signedUrl: `${constants.apiUrl}/s3-signed-urls`,
            attachments: `${constants.apiUrl}/attachments`,
            getAttachments: `${constants.apiUrl}/attachments?resourceType=task&resourceId=`,
            deleteAttachments:`${constants.apiUrl}/attachments/`,
            
            getPlannedTask:`${constants.apiUrl}/tasks?limit=1000&sort=progression&planned-maintenance[plannedMaintenance.isDisabled]=false&equipment.isDisabled=false&types[0]=planned-maintenance&status=open`,
            patchTask: `${constants.apiUrl}/tasks/`,

            listEquipment: `${constants.apiUrl}/equipment?isDisabled=false&limit=1000`,
            listDepartment: `${constants.apiUrl}/departments?limit=150&sort=-name`,

            getUnplannedTask:`${constants.apiUrl}/tasks?limit=234&unplanned-maintenance[isDisabled]=false&equipment.isDisabled=false&sort=-updatedAt&types[0]=unplanned-maintenance&status=open`,
            getMeterTask: `${constants.apiUrl}/equipment?hasHourMeter=true&isDisabled=false&isHourMeterEnabled=true&limit=200&sort=-name&limit=20`,
            getHisoriqueTask:`${constants.apiUrl}/tasks?sort=actualResolutionDate&limit=3&status=closed&isDisabled=false&plannedMaintenanceId=`,
            updateMeter: `${constants.apiUrl}/readings`,
            getMeterHistorique: `${constants.apiUrl}/readings?equipmentId=5ccbdc33bff4740017d96634&limit=3`,

            getStats:`${constants.apiUrl}/stats/dashboards/sailors`,
            getToDoTasks: `${constants.apiUrl}/tasks?status=open&planned-maintenance[plannedMaintenance.isDisabled]=false&types[0]=planned-maintenance&equipment.isDisabled=false&sort=-dueDate&limit=4`
        }
        


