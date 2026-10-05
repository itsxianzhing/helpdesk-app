using System.Net;

namespace Helpdesk.Exceptions;

public class ConflictException : AppException
{
    public string Code { get; }

    public ConflictException(
        string message,
        string code)
        : base(message, (int)HttpStatusCode.Conflict)
    {
        Code = code;
    }
}
