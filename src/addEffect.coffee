import {useEffect} from 'react'

import createEffectAdder from './createEffectAdder'

addEffect = createEffectAdder useEffect

export default addEffect
