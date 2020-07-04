import {useLayoutEffect} from 'react'

import createEffectAdder, {AddEffectType} from 'utils/createEffectAdder'

const addLayoutEffect: AddEffectType = createEffectAdder(useLayoutEffect)

export default addLayoutEffect
