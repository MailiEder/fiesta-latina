import '@styles/globals.css';

export const metadata = {
    title: "Ortenaumeisterschaft 2023",
    description: 'Mit der Unterstüzung des LFV Schutterwald'
}

const RootLayout = ({ children }) => {
  return (
    <html lang='de'>
        <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"></link>
      <link href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css" rel="stylesheet"/>
      <link href="https://cdn.datatables.net/responsive/2.4.1/css/responsive.dataTables.min.css" rel="stylesheet" />
      </head>
        <body>            
            <main>
                {children}
            </main>
        </body>
    </html>
  )
}

export default RootLayout