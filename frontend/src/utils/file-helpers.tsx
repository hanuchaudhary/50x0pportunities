export const isValidFileType = (file: File, acceptedTypes: string[]) => {
    return acceptedTypes.includes(file.type);
  };
  
  export const isValidFileSize = (file: File, maxSizeInBytes: number) => {
    return file.size <= maxSizeInBytes;
  };
  
  