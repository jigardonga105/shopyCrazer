import { authJS } from './auth'
import { handleStore } from './seller'
import { addProd } from './addProd'
import { updateProd } from './updateProd'
import { shopSingle } from './shopSingle'

authJS()
handleStore()
addProd()
updateProd()
shopSingle()