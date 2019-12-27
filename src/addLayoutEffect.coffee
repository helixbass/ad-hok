import {useLayoutEffect} from 'react'

import createEffectAdder from './createEffectAdder'

addLayoutEffect = createEffectAdder useLayoutEffect

export default addLayoutEffect
