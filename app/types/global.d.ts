declare namespace NodeJS {
    interface Global {
      mongo: {
        conn: any;
        promise: Promise<any> | null;
      };
    }
  }
  
  export {}
  