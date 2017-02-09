using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class IdGenerator : IIdGenerator
    {
        public IdGenerator()
        {
            _lastId = 0;
        }

        private int _lastId;

        public int NextId()
        {
            _lastId += 1;
            return _lastId;
        }
    }
}
