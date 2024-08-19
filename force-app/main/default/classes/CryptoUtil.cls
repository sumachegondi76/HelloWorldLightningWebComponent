public class CryptoUtil {
  public static String hashPassword(String password) {
    Blob passwordBlob = Blob.valueOf(password);
    Blob hashedBlob = Crypto.generateDigest('SHA-256', passwordBlob);
    return EncodingUtil.convertToHex(hashedBlob);
  }
}
