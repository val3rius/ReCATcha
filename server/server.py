"""Usage: catcha_server.py SERVER_PORT 

Uses OpenCV's cat classifier to check image for cats, returns true or false.

Arguments:
    SERVER_PORT port on which to start listening for image payloads
"""
import numpy as np
import cv2
import socket
from docopt import docopt
import sys
from threading import Thread
import base64

def check_for_cat(img_string):
    img = cv2.imdecode(np.fromstring(base64.b64decode(img_string), np.uint8), cv2.IMREAD_COLOR)

    detector = cv2.CascadeClassifier("haarcascade_frontalcatface_extended.xml")
    rects = detector.detectMultiScale(img, scaleFactor=1.3, minNeighbors=3, minSize=(75,75))

    if len(rects)== 0:
        return "not_cat" #print("not_cat")
    else:
        return "cat" #print("cat")

def start_server(port):
    soc = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    soc.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    print('Socket created')
    
    try:
        soc.bind(("127.0.0.1", port))
        print('Socket bind complete')
    except socket.error as msg:
        print('Bind failed. Error : ' + str(sys.exc_info()))
        sys.exit()

    soc.listen(10) #lol what does 10 even mean here???
    
    while True:
        conn, addr = soc.accept()
        ip, port = str(addr[0]), str(addr[1])
        print('Accepting connection from ' + ip + ':' + port)
        try:
            Thread(target=client_thread, args=(conn, ip, port)).start()
        except:
            print("Terible error!")
            import traceback
            traceback.print_exc()
    soc.close()


def client_thread(conn, ip, port, MAX_BUFFER_SIZE = 50000):

    # the input is in bytes, so decode it
    input_from_client_bytes = conn.recv(MAX_BUFFER_SIZE)

    # MAX_BUFFER_SIZE is how big the message can be
    # this is test if it's sufficiently big
    import sys
    siz = sys.getsizeof(input_from_client_bytes)
    if  siz >= MAX_BUFFER_SIZE:
        print("The length of input is probably too long: {}".format(siz))

    # decode input and strip the end of line
    input_from_client = input_from_client_bytes.decode("utf8").rstrip()

    res = do_some_stuffs_with_input(input_from_client)
    print("Result of processing {} is: {}".format(input_from_client, res))

    vysl = res.encode("utf8")  # encode the result string
    conn.sendall(vysl)  # send it to client
    conn.close()  # close connection
    print('Connection ' + ip + ':' + port + " ended")

def do_some_stuffs_with_input(input_string):  
    """
    This is where all the processing happens.

    Let's just read the string backwards
    """

    return check_for_cat(input_string) #input_string[::-1]



if __name__ == '__main__':
    args = docopt(__doc__)
    start_server(int(args['SERVER_PORT']))
    #check_for_cat(args['PATH_TO_IMAGE_THAT_MIGHT_CONTAIN_A_CAT'])

