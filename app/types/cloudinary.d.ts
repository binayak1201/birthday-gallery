declare module 'cloudinary' {
  interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }

  interface CloudinaryUploader {
    upload_stream: (options: any, callback: (error: any, result: any) => void) => any;
  }

  interface CloudinarySearch {
    expression: (query: string) => CloudinarySearch;
    sort_by: (field: string, direction: string) => CloudinarySearch;
    execute: () => Promise<any>;
  }

  interface CloudinaryV2 {
    config: (config: CloudinaryConfig) => void;
    uploader: CloudinaryUploader;
    search: CloudinarySearch;
  }

  const v2: CloudinaryV2;
  export { v2 };
}
