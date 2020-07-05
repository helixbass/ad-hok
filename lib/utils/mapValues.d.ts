declare const mapValues: <TObject extends {}, TReturnValue>(callback: (value: TObject[keyof TObject], key: keyof TObject) => TReturnValue, obj: TObject) => { [key in keyof TObject]: TReturnValue; };
export default mapValues;
