import { DataSource } from 'typeorm';

import { TypeOrmConfigurationStatic } from '#config/database/postgresql/type-orm-configuration-static';

export default new DataSource(TypeOrmConfigurationStatic.config);
