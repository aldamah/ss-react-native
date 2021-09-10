export const refreshMethod = () => {
    let nullValue = []
    const action = { type: 'FILTER_ACTION', value: nullValue }
    this.props.dispatch(action)

    const actionShip = { type: 'SHIP_ACTION', value: null }
    this.props.dispatch(actionShip)

    const actionDepartment = { type: 'DEPARTMENT_ACTION', value: null }
    this.props.dispatch(actionDepartment)
    const actionEquipment = { type: 'EQUIPMENT_ACTION', value: null }

    this.props.dispatch(actionEquipment)
    const activeDepartment = { type: 'DEPARTMENT_ACTIVE', value: true }
    this.props.dispatch(activeDepartment)
    const activeEquipment = { type: 'EQUIPMENT_ACTIVE', value: true }
    this.props.dispatch(activeEquipment)

    const actionS = { type: 'SHIP_NAME_ACTION', value: null }
    this.props.dispatch(actionS)
    const actionE = { type: 'EQUIPMENT_NAME_ACTION', value: null }
    this.props.dispatch(actionE)
    const actionD = { type: 'DEPARTMENT_NAME_ACTION', value: null }
    this.props.dispatch(actionD)

    const actionV = { type: 'VISIBLE_ACTION', value: false }
    this.props.dispatch(actionV)
    const actionRES = { type: 'RESULT_ACTION', value: false }
    this.props.dispatch(actionRES)

    const actionCompteDe = { type: 'FILTERDEPARTMENT_COMPTE_ACTION', value: 0 }
    this.props.dispatch(actionCompteDe)
    const actionCompte = { type: 'FILTEREQUIPMENT_COMPTE_ACTION', value: 0 }
    this.props.dispatch(actionCompte)
    const actionCompteSh = { type: 'FILTERSHIP_COMPTE_ACTION', value: 0 }
    this.props.dispatch(actionCompteSh)

    const actionO = { type: 'OVERLAY_ACTION', value: false }
    this.props.dispatch(actionO)
    const actionFIl = { type: 'FILTEREQUIPMENTLENGTH_ACTION', value: 0 }
    this.props.dispatch(actionFIl)


    const actionBS = { type: 'BADGE_SHIP_ACTION', value: false }
    this.props.dispatch(actionBS)
    const actionBDE = { type: 'BADGE_DEPARTMENT_ACTION', value: false }
    this.props.dispatch(actionBDE)
    const actionBE = { type: 'BADGE_EQUIPMENT_ACTION', value: false }
    this.props.dispatch(actionBE)

  }