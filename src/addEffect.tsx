import {useEffect} from 'react'

import createEffectAdder, {AddEffectType} from 'utils/createEffectAdder'

const addEffect: AddEffectType = createEffectAdder(useEffect)

export default addEffect
